// my-fire-monitor-frontend/src/components/DateRangePicker.tsx

import React from 'react';
import './DateRangePicker.css';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onApply: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApply
}) => {
    return (
        <div className="date-range-picker">
            <label htmlFor="startDate">Data Início:</label>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
            />
            <label htmlFor="endDate">Data Fim:</label>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
            />
            <button onClick={onApply}>Atualizar Mapas</button>
        </div>
    );
};

export default DateRangePicker;