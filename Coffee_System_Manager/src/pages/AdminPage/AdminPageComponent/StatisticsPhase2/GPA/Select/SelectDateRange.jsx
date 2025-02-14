import React from "react";
import { ConfigProvider, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const SelectDateRange = ({ onSelect }) => {
  const handleDateChange = (dates, dateStrings) => {
    if (!dates) {
      onSelect(); // Xóa giá trị đã chọn khi dates là null
    } else {
      onSelect(dates);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            cellWidth: 22,
            withoutTimeCellHeight: 40,
          },
        },
      }}
    >
      <RangePicker
        picker="year"
        style={{ width: "100%", borderRadius: "10px", height: "41px" }}
        onChange={handleDateChange}
      />
    </ConfigProvider>
  );
};

export default SelectDateRange;
