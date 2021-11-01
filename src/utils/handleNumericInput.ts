export const handleNumericInput = (value: string, setValue: (value: string) => void): void => {
  if (/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(value) || value === '') {
    setValue(value);
  }
};
