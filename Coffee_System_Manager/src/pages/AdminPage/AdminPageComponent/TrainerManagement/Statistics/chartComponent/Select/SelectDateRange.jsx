import React from "react";
import { ConfigProvider, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const SelectDateRange = ({ onSelect }) => {
  const handleDateChange = (dates, dateStrings) => {
    onSelect(dates);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            cellWidth: 30,
            withoutTimeCellHeight: 40
          },
        },
      }}
    >
      <RangePicker
        picker="year"
        style={{ width: "100%", borderRadius: "10", height: "41px" }}
        onChange={handleDateChange}
      />
    </ConfigProvider>

  );
};

export default SelectDateRange;
