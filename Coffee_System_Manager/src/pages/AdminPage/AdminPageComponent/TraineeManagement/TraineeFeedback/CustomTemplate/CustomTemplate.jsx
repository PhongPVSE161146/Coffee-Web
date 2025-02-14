import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomTemplate.css";
import {
  CloseOutlined,
  VerticalAlignBottomOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { fetchData } from "./components/ApiService/apiServices";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../../../components/Notifications/Notifications";
import {
  deleteFeedback,
  fetchAllFeedbackClassname,
} from "../ClassTemplate/ApiService/apiServices";
import SendFeedbackPopup from "../SendFeedbackPopup";
import { Pagination } from "antd";
import ErrorFeedback from "../../../../../../assets/errorfeedback.png";

const DeleteConfirmPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <div className="delete-header">
          <span>DELETE TEMPLATE</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="delete-body">
          <p>Are you sure want to delete template?</p>
          <div className="delete-actions">
            <button className="no-btn" onClick={onClose}>
              No
            </button>
            <button className="yes-btn" onClick={onConfirm}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortDropdown = ({ value, onChange, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOptions(options.map((opt) => opt.id));
    } else {
      setSelectedOptions([]);
    }
    onChange(checked ? options.map((opt) => opt.id) : []);
  };

  const handleOptionClick = (optionId) => {
    setSelectedOptions((prev) => {
      const newSelection = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      onChange(newSelection);
      return newSelection;
    });
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = selectedOptions.length === options.length;

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <div className="sort-dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        Sort
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="sort-dropdown-content">
          <div className="sort-dropdown-search">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="sort-dropdown-options">
            <label className="sort-option">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>Select All</span>
            </label>
            {filteredOptions.map((option) => (
              <label key={option.id} className="sort-option">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionClick(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomTemplate = () => {
  const role = sessionStorage.getItem("selectedRole");
  const [sortOption, setSortOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const menuButtonRefs = useRef({});
  const navigate = useNavigate();
  const [showSendFeedback, setShowSendFeedback] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackTemplateId, setFeedbackTemplateId] = useState(null);
  const [classname, setClassname] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData();
      if (response.success) {
        const formattedTemplates = response.data.map((template) => ({
          id: template.id,
          title: template.title,
          createdBy: template.createdBy,
          lastUpdate: new Date(template.lastModifiedDate).toLocaleDateString(),
          image: ErrorFeedback,
        })).reverse();

        setTemplates(formattedTemplates);
        setTotalItems(formattedTemplates.length);

        const uniqueCreators = [
          ...new Set(formattedTemplates.map((template) => template.createdBy)),
        ];
        const templateOptions = uniqueCreators.map((creator, index) => ({
          id: index.toString(),
          label: creator,
        }));
        setOptions(templateOptions);
      }
    } catch (error) {
      showErrorNotification("Error loading templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
    loadClassName();
  }, []);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    setTotalItems(100);
    setTemplates(
      Array(100)
        .fill()
        .map((_, index) => ({
          id: index,
          title: `Template ${index + 1}`,
          lastUpdate: new Date().toLocaleDateString(),
          createdBy: "User",
        }))
    );
  }, []);

  const loadClassName = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllFeedbackClassname();
      setClassname(response.data);

    } catch (error) {
      showErrorNotification("Error loading class details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideAnyButton = Object.values(menuButtonRefs.current).some(
        (buttonRef) => buttonRef && buttonRef.contains(event.target)
      );
      const isClickInsideMenu = event.target.closest('.template-menu-cus-cus');

      if (!isClickInsideAnyButton && !isClickInsideMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const TemplateMenu = ({ onClose, onCustom, onUse, onDelete, templateId }) => {
    return (
      <div className="template-menu-cus-cus">
        {role === 'admin' && (
          <>
            <div className="menu-item" onClick={onCustom}>
              <div className="menu-icon">✎</div>
              <div className="menu-text">Custom Template</div>
            </div>
            <div className="menu-item" onClick={() => onDelete(templateId)}>
              <div className="menu-icon delete">
                <CloseOutlined />
              </div>
              <div className="menu-text">Delete Template</div>
            </div>
            <div className="menu-item" onClick={onUse}>
              <div className="menu-icon">
                <VerticalAlignBottomOutlined />
              </div>
              <div className="menu-text">Use Template</div>
            </div>
          </>
        )}
        {role === "deliverymanager" && (
          <>
            <div className="menu-item" onClick={onCustom}>
              <div className="menu-icon">✎</div>
              <div className="menu-text">Custom Template</div>
            </div>
            <div className="menu-item" onClick={() => onDelete(templateId)}>
              <div className="menu-icon delete">
                <CloseOutlined />
              </div>
              <div className="menu-text">Delete Template</div>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <VerticalAlignBottomOutlined />
              </div>
              <div className="menu-text">Export Template</div>
            </div>
            <div className="menu-item">
              <div className="menu-icon">✎</div>
              <div className="menu-text">Clone Template</div>
            </div>
          </>
        )}
      </div>
    );
  };

  const deleteTemplateHandler = async (templateId) => {
    try {
      setIsLoading(true);

      await deleteFeedback(templateId);
      showSuccessNotification("Template deleted successfully");
      await loadTemplates();

    } catch (error) {
      showErrorNotification("Failed to delete template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuClick = (templateId) => {
    setActiveMenu(activeMenu === templateId ? null : templateId);
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };


  const handleCustomTemplate = (templateId) => {
    setIsEditMode(true); // Correctly using state setter
    if (role === 'admin') navigate(`/adminPage/feedback-template/${templateId}`);
    if (role === 'deliverymanager') {
        navigate(`/DeliveryManagerPage/feedback-template/${templateId}`);
        setIsEditMode(true);
    }
    handleCloseMenu();
};

  const handleUseTemplate = (templateId) => {
    setFeedbackTemplateId(templateId);
    setShowSendFeedback(true);
    handleCloseMenu();
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirm(true);
    handleCloseMenu();
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplateHandler(templateToDelete, loadTemplates);
      setTemplateToDelete(null);
      setShowDeleteConfirm(false); // Reset the template to delete
    }
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (sortOption.length === 0 ||
        sortOption.includes(
          options.find((opt) => opt.label === template.createdBy)?.id
        ))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );


  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingOutlined style={{ fontSize: 30 }} spin />
        {/* <p>Loading templates...</p> */}
      </div>
    );
  }

  return (
    <div className="custom-template">
      <div className="template-header">
        <div className="sort-search-cus">
          {role === "admin" && (
            <>
              <select
                value={sortOption}
                onChange={(e) => setSortOption([e.target.value])}
                className="sort-dropdown"
              >
                <option value="">All</option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter key words"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </>
          )}
          {role === "deliverymanager" && (
            <>
              <SortDropdown
                value={sortOption}
                onChange={setSortOption}
                options={options}
              />
              <input
                type="text"
                placeholder="Enter key words"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </>
          )}
        </div>
      </div>
      <div className="template-grid">
        {currentTemplates.map((template) => (
          <div key={template.id} className="template-card-cus-cus">
            <img src={template.image} alt={template.title} className="template-image" />
            <div className="template-content-cus">
              <div className="template-info">
                {/* <h3>{template.title}</h3> */}
                <h3 className="template-title" title={template.title}>
                  {template.title.length > 25
                    ? `${template.title.slice(0, 25)}...`
                    : template.title}
                </h3>
                <p>Last Update: {template.lastUpdate}</p>
                <p>Created By: {template.createdBy}</p>
              </div>
              <div className="template-actions">
                <span></span>
                <button
                  className="menu-button"
                  onClick={() => handleMenuClick(template.id)}
                  ref={(el) => (menuButtonRefs.current[template.id] = el)}
                >
                  ⋮
                </button>
              </div>
              {activeMenu === template.id && (
                <TemplateMenu
                  onClose={handleCloseMenu}
                  onCustom={() => handleCustomTemplate(template.id)}
                  onUse={() => handleUseTemplate(template.id)}
                  onDelete={() => handleDeleteTemplate(template.id)}
                  templateId={template.id}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="pagination">
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>

        </select>
        <span>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTemplates.length)} of {filteredTemplates.length}</span>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ▶
        </button>
      </div> */}

      {/* <div className="pagination">
        <Pagination
          current={currentPage} // Current page number
          pageSize={itemsPerPage} // Number of items per page
          total={totalPages} // Total number of items
          showSizeChanger // Show the page size changer
          pageSizeOptions={['4', '8', '12']} // Options for items per page
          onChange={handlePageChange} // Handle page change
          onShowSizeChange={(current, pageSize) => handleItemsPerPageChange(pageSize)} // Handle page size change
        />
      </div> */}

      <div className="pagination">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          showSizeChanger
          pageSizeOptions={["4", "8", "12"]}
          onChange={handlePageChange}
          onShowSizeChange={handlePageChange}
        />
      </div>

      {showSendFeedback && classname.length > 0 && feedbackTemplateId && (
        <SendFeedbackPopup
          onClose={() => setShowSendFeedback(false)}
          options={options}
          feedbackTemplateId={feedbackTemplateId}
          classNames={classname}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmPopup
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CustomTemplate;
