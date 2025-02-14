import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ClassTemplate.css';
import { CloseOutlined, VerticalAlignBottomOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { showErrorNotification, showSuccessNotification } from '../../../../../../components/Notifications/Notifications';
import { cloneFeedback, deleteFeedback, fetchAllFeedbackClassname, fetchData } from './ApiService/apiServices';
import SendFeedbackPopup from '../SendFeedbackPopup';
import { Pagination } from 'antd';
import ErrorFeedback from '../../../../../../assets/errorfeedback.png'

const DeleteConfirmPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-confirm">
        <div className="delete-header">
          <span>DELETE TEMPLATE</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="delete-body">
          <p>Are you sure want to delete template?</p>
          <div className="delete-actions">
            <button className="no-btn" onClick={onClose}>No</button>
            <button className="yes-btn" onClick={onConfirm}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassTemplate = () => {
  const location = useLocation(); // Get the location object
  const role = sessionStorage.getItem("selectedRole");
  const [sortOption, setSortOption] = useState('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const menuButtonRefs = useRef({});
  const navigate = useNavigate();
  const [showSendFeedback, setShowSendFeedback] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [classname, setClassname] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackTemplateId, setFeedbackTemplateId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check if the refresh state is present
    if (location.state && location.state.refresh) {
      loadClassTemplate(); // Fetch new data if refresh is indicated
    } else {
      loadClassTemplate(); // Fetch data on initial load
    }
    loadClassName();
  }, [location.state]);

  const loadClassTemplate = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData();
      if (response.success) {
        const formattedTemplates = response.data.map(template => ({
          id: template.id,
          title: template.title,
          createdBy: template.createdBy,
          lastUpdate: new Date(template.lastModifiedDate),
          image: ErrorFeedback,
        }));
        setTemplates(formattedTemplates);
      }
    } catch (error) {
      //console.error("Error loading class details:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const loadClassName = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllFeedbackClassname();
      setClassname(response.data);
      //console.log('class data: ', response.data);
    } catch (error) {
      //console.error("Error loading class details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideAnyButton = Object.values(menuButtonRefs.current).some(
        buttonRef => buttonRef && buttonRef.contains(event.target)
      );
      const isClickInsideMenu = event.target.closest('.template-menu-class');

      if (!isClickInsideAnyButton && !isClickInsideMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const TemplateMenu = ({ onClose, onCustom, onClone, onUse, onDelete }) => {
    return (
      <div className="template-menu-class">
        {role === 'admin' && (
          <>
            <div className="menu-item" onClick={onClone}>
              <div className="menu-icon">✎</div>
              <div className="menu-text">Clone Template</div>
            </div>
            <div className="menu-item" onClick={onUse}>
              <div className="menu-icon check">✓</div>
              <div className="menu-text">Use Template</div>
            </div>
          </>
        )}
        {role === 'deliverymanager' && (
          <>
            <div className="menu-item" onClick={onCustom}>
              <div className="menu-icon">✎</div>
              <div className="menu-text">Custom Template</div>
            </div>
            <div className="menu-item" onClick={onDelete}>
              <div className="menu-icon delete"><CloseOutlined /></div>
              <div className="menu-text">Delete Template</div>
            </div>
            <div className="menu-item">
              <div className="menu-icon"><VerticalAlignBottomOutlined /></div>
              <div className="menu-text">Export Template</div>
            </div>
            <div className="menu-item" onClick={onClone}>
              <div className="menu-icon">✎</div>
              <div className="menu-text">Clone Template</div>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // const handleMenuClick = (templateId) => {
  //   setActiveMenu(activeMenu === templateId ? null : templateId);
  // };

  const handleMenuClick = (event, templateId) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === templateId ? null : templateId);
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };

  const handlePageSizeChange = (current, size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const cloneTemplateHandler = async (templateId, role, navigate, handleCloseMenu) => {
    try {
      setIsLoading(true);
      await cloneFeedback(templateId);

      showSuccessNotification("Template cloned successfully");

      if (role === "admin") {
        navigate("/adminPage/traineeManagement/customTemplate");
      }
      else if (role === "deliverymanager") {
        navigate("/DeliveryManagerPage/traineeManagement/customTemplate");
      }
    } catch (error) {
      showErrorNotification("Failed to clone template. Please try again.");
    } finally {
      setIsLoading(false);
      handleCloseMenu();
    }
  };

  const handleCloneTemplate = (templateId) => {
    cloneTemplateHandler(templateId, role, navigate, loadClassTemplate, handleCloseMenu);
  };

  const deleteTemplateHandler = async (templateId, loadClassTemplate, handleCloseMenu) => {
    try {
      setIsLoading(true);
      await deleteFeedback(templateId);
      showSuccessNotification("Template deleted successfully");

      await loadClassTemplate(); // Refresh the template list after deletion
    } catch (error) {
      showErrorNotification("Failed to delete template. Please try again.");
    } finally {
      setIsLoading(false);
      handleCloseMenu();
    }
  };


  const handleUseTemplate = (templateId) => {
    setFeedbackTemplateId(templateId);
    setShowSendFeedback(true);
    handleCloseMenu();
  };

  const handleCustomTemplate = (templateId) => {
    let updatedTemplateId = templateId;
    localStorage.setItem(updatedTemplateId, "templateId");
    setIsEditMode(true);
    if (role === 'admin') {
      navigate(`/adminPage/feedback-template/${updatedTemplateId}`);
    } else if (role === 'deliverymanager') {
      navigate(`/DeliveryManagerPage/feedback-template/${updatedTemplateId}`);
    }
    handleCloseMenu();
  };


  const handleDeleteTemplate = (templateId) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirm(true);
    handleCloseMenu();
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplateHandler(templateToDelete, loadClassTemplate, () => setShowDeleteConfirm(false));
      setTemplateToDelete(null); // Reset the template to delete
    }
  };

  const sortTemplates = (templates) => {
    return templates.sort((a, b) => {
      if (sortOption === 'Latest') {
        return b.lastUpdate - a.lastUpdate;
      } else {
        return a.lastUpdate - b.lastUpdate;
      }
    });
  };

  const filteredAndSortedTemplates = sortTemplates(
    templates.filter(template =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredAndSortedTemplates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedTemplates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
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
        <div className="sort-search-class">
          <div className="sort-dropdown-class">
            <select value={sortOption} onChange={handleSort}>
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Enter key words"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="template-grid">
        {currentTemplates.map((template) => (
          <div key={template.id} className="template-card-class">
            <img src={template.image} alt={template.title} className="template-image" />
            <div className="template-content-cus">
              <div className="template-info">
                {/* <h3>{template.title}</h3> */}
                <h3 className="template-title" title={template.title}>
                  {template.title.length > 25 ? `${template.title.slice(0, 25)}...` : template.title}
                </h3>
                <p>Last Update: {template.lastUpdate.toLocaleDateString()}</p>
                <p>Created By: {template.createdBy}</p>
              </div>
              <div className="template-actions">
                <button
                  className="menu-button"
                  onClick={(e) => handleMenuClick(e, template.id)}
                  ref={el => menuButtonRefs.current[template.id] = el}
                >
                  ⋮
                </button>
              </div>
              {activeMenu === template.id && (
                <TemplateMenu
                  onClose={handleCloseMenu}
                  onClone={() => handleCloneTemplate(template.id)}
                  onUse={() => handleUseTemplate(template.id)}
                  onDelete={() => handleDeleteTemplate(template.id)}
                  onCustom={() => handleCustomTemplate(template.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredAndSortedTemplates.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger
          pageSizeOptions={['4', '8', '12']}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>

      {showSendFeedback && (
        <SendFeedbackPopup
          onClose={() => setShowSendFeedback(false)}
          classNames={classname}
          feedbackTemplateId={feedbackTemplateId}
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

export default ClassTemplate;