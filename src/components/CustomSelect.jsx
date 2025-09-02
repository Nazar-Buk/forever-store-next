"use client";

const CustomSelect = (props) => {
  const {
    value,
    onChange,
    onBlur,
    setIsCustomSelectOpen,
    emptyLabel,
    selectData,
    isSelectOpen,
    isDisabled = false,
  } = props;

  const handleSelectOption = (e, optionData) => {
    onChange(optionData); // оновлює значення в useForm
    e.stopPropagation(); // зупиняє "всплиття" (event bubbling) події вгору по DOM, щоб не було подвійного кліку, коли onClick є на бітьківському та дочірньому елементах
    setIsCustomSelectOpen(false);
  };

  return (
    <div
      tabIndex={0} // дозволяє фокус
      className={`custom-select ${isDisabled ? "disabledDiv" : ""}`}
      onClick={() => setIsCustomSelectOpen((prev) => !prev)}
      onBlur={() => {
        setIsCustomSelectOpen(false);
        onBlur(); // вручну викликаємо валідацію
      }}
    >
      <div className="custom-select__checked-label">
        {value.optionLabel || emptyLabel}
      </div>
      <svg
        className="drop-down-arrow"
        style={{
          transform: isSelectOpen ? "rotate(-90deg)" : "rotate(90deg)",
        }}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 330 330"
        xmlSpace="preserve"
        strokeWidth="0.0033"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />

        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            id="XMLID_222_"
            d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
          />{" "}
        </g>
      </svg>
      {isSelectOpen && (
        <div className="custom-select__items">
          <div
            className="custom-select__item"
            onClick={(e) =>
              handleSelectOption(e, {
                optionValue: "",
                optionLabel: emptyLabel,
              })
            }
          >
            {emptyLabel}
          </div>
          {selectData?.map((item, ind) => (
            <div
              key={ind}
              className="custom-select__item"
              onClick={(e) => handleSelectOption(e, item)}
            >
              {item.optionLabel}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
