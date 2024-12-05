import { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

interface SearchableSelectProps {
    "available_options": string[];
    "value": string | null;
    "setValue": Dispatch<SetStateAction<string | null>>;
    "placeholder"?: string
}

export const SearchableSelect:React.FC<SearchableSelectProps> = ({
    available_options,
    value,
    setValue,
    placeholder = "Search value...",

}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });


  const [search, setSearch] = useState('');

  const shouldFilterOptions = available_options.every((item) => item !== search);
  const filteredOptions = shouldFilterOptions
    ? available_options.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    : available_options;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          placeholder={value ? value : placeholder}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Arama bulunamadı</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}