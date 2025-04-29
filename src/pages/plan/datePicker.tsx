import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type DatePickerValueProps = {
  value: Dayjs|null;
  setValue: (value: Dayjs|null) => void;
  defaultValue: Dayjs;
}

export default function DatePickerValue({value, setValue, defaultValue} :DatePickerValueProps) {
  // const [_, setValue] = React.useState<Dayjs | null>(dayjs(defaultValue));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        {/* <DatePicker label="Uncontrolled picker" defaultValue={(defaultValue)} /> */}
        <DatePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}