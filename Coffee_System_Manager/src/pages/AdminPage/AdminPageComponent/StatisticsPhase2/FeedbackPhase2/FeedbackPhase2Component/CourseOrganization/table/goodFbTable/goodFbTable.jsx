import { Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  fetchModuleByTrainerData,
  fetchTechnicalGroupData,
} from "../apiService";
import "./goodFbTable.css";

function GoodFbTable({ moduleName, classCode, trainerAccount, trackValue }) {
  const [selectedModule, setSelectedModule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await (trackValue === "trackBy_module"
          ? fetchTechnicalGroupData(classCode)
          : fetchModuleByTrainerData(trainerAccount, classCode));

        if (isMounted && data?.data) {
          const filteredData = data.data.filter(
            (item) => item.moduleName === moduleName
          );
          setSelectedModule(filteredData);
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (
      moduleName &&
      classCode &&
      (trainerAccount || trackValue === "trackBy_module")
    ) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [moduleName, classCode, trainerAccount, trackValue]);

  const flattenedDataSource = React.useMemo(() => {
    return (
      selectedModule[0]?.goodFeedbackList?.map((reason, index) => ({
        key: index + 1,
        classCode: selectedModule[0]?.classCode,
        classAdmin:
          trackValue === "trackBy_module"
            ? selectedModule[0]?.classAdmin
            : trainerAccount,
        moduleName: selectedModule[0]?.moduleName,
        reason: reason,
      })) || []
    );
  }, [selectedModule, trackValue, trainerAccount]);

  const calculateRowSpan = (data, dataIndex) => {
    const rowSpanMap = {};

    data.forEach((item, index) => {
      if (index === 0 || item[dataIndex] !== data[index - 1][dataIndex]) {
        let spanCount = 1;
        for (let i = index + 1; i < data.length; i++) {
          if (data[i][dataIndex] === item[dataIndex]) {
            spanCount++;
          } else {
            break;
          }
        }
        rowSpanMap[index] = spanCount;
      } else {
        rowSpanMap[index] = 0;
      }
    });

    return rowSpanMap;
  };
  const rowSpanMap = calculateRowSpan(flattenedDataSource, "classAdmin");
  const rowSpanMap2 = calculateRowSpan(flattenedDataSource, "classCode");
  const rowSpanMap3 = calculateRowSpan(flattenedDataSource, "moduleName");

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Class",
      dataIndex: "classCode",
      key: "classCode",
      width: 80,
      render: (classCode, _, index) => ({
        children: <span>{classCode}</span>,
        props: {
          rowSpan: rowSpanMap2[index] || 0,
        },
      }),
    },
    {
      title: "Trainer",
      dataIndex: "classAdmin",
      key: "classAdmin",
      width: 100,
      render: (classAdmin, _, index) => ({
        children: <span>{classAdmin}</span>,
        props: {
          rowSpan: rowSpanMap[index] || 0,
        },
      }),
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 120,
      render: (moduleName, _, index) => ({
        children: <span>{moduleName}</span>,
        props: {
          rowSpan: rowSpanMap3[index] || 0,
        },
      }),
    },
    {
      title: "Reason for Good Feedbacks",
      dataIndex: "reason",
      key: "reason",
      width: 90,
      render: (text) => <span>{text}</span>,
    },
  ];

  return (
    <div className="good-feedback-table">
      <Table
        size="small"
        columns={columns}
        dataSource={flattenedDataSource}
        loading={isLoading}
      />
    </div>
  );
}

export default GoodFbTable;
