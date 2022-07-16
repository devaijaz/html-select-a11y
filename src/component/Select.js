import React, { useState, useRef, useEffect, createRef, useCallback } from "react";
import { Checked, DownArrow } from "./Icon";

const Select = ({ label, options = {}, renderItem, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(() => {
    if (value) {
      const index = options.findIndex((option) => option.value === value);
      if (index > -1) {
        return {
          option: options[index],
          index
        };
      }
    }
    return null;
  });
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [optionsRef, setOptionsRef] = useState([]);
  const [overlayTop, setOverlayTop] = useState(0);

  const labelRef = useRef(null);

  const onSelectClick = () => {
    setIsOpen((snapshot) => !snapshot);
  };

  const highlight = (optionIndex) => {
    setHighlightedIndex(optionIndex);
  };
  const selectItem = (optionIndex) => {
    setSelectedItem((_) => {
      const value =
        optionIndex === null
          ? null
          : {
            option: options[optionIndex],
            index: optionIndex
          };
      onChange && onChange(value && value.option.value);
      return value;
    });
    setIsOpen(false);
    labelRef.current.focus();
  };

  const onItemKeyDown = (index, e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      selectItem(index);
      setIsOpen(false);
      labelRef.current.focus();
      return;
    }
    if (e.keyCode === 27 || e.keyCode === 9) {
      setIsOpen(false);
      setHighlightedIndex(null);
      return;
    }
    let newIndex = highlightedIndex;
    if (e.keyCode === 38) {
      newIndex -= 1;
    } else if (e.keyCode === 40) {
      newIndex += 1;
    }
    newIndex = newIndex < 0 ? newIndex + options.length : newIndex;
    newIndex = newIndex % options.length;
    highlight(newIndex);
  };
  const onSelectPressed = (e) => {
    if (e.keyCode !== 9) {
      e.preventDefault();
    }
    if (e.keyCode === 40 && isOpen) {
      highlight(0);
      return;
    }
    if ([32, 13, 40].includes(e.keyCode)) {
      setIsOpen(o => !o);
      return;
    }
    if (e.keyCode === 27 || e.keyCode === 9) {
      setIsOpen(_ => false);
    }
    if (e.keyCode === 27) {
      selectItem(null);
    }
  };
  useEffect(() => {
    if (options.length) {
      setOptionsRef(options.map((e) => createRef()));
    } else {
      setOptionsRef([]);
    }
  }, [options]);

  useEffect(() => {
    if (isOpen && highlightedIndex != null) {
      const ref = optionsRef[highlightedIndex];
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [isOpen, highlightedIndex, optionsRef]);

  useEffect(() => {
    setOverlayTop(labelRef.current?.offsetHeight + 2 || 0);
  }, [labelRef]);

  const getLabel = () => {
    if (selectedItem) {
      return selectedItem.option.label;
    }
    return label;
  };
  const clickOutSideHandler = (e) => {
    if (componentRef.current) {
      if (!componentRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("click", clickOutSideHandler);

    return () => {
      document.removeEventListener("click", clickOutSideHandler);
    };
  }, []);
  const getRecommendedItemProps = (option, index) => {
    let clazz = "select__option";
    if (index === highlightedIndex) {
      clazz += " highlighted";
    }
    if (selectedItem && selectedItem.index === index) {
      clazz += " selected";
    }
    return {
      key: option.value,
      tabIndex: "-1",
      className: clazz,
      onClick: () => selectItem(index)
    };
  };
  return (
    <div className="select" ref={componentRef}>
      <button
        onKeyDown={onSelectPressed}
        ref={labelRef}
        className="select__label"
        aria-controls="list-overlay"
        aria-haspopup="true"
        aria-keyshortcuts="Down Key"
        aria-expanded={isOpen ? true : false}
        onClick={onSelectClick}
      >
        <span>{getLabel()}</span>
        <DownArrow className={isOpen ? 'listopen' : ''} />
      </button>
      <ul
        id="list-overlay"
        className="select__list"
        aria-current={highlightedIndex}
        style={{ top: overlayTop + "px" }}
      >
        {isOpen &&
          options.map((option, index) => {
            if (renderItem) {
              let isSelected = selectedItem && selectedItem.index === index;
              return renderItem(
                option,
                getRecommendedItemProps(option, index),
                isSelected
              );
            }
            return (
              <li
                aria-posinset={index + 1}
                {...getRecommendedItemProps(option, index)}
                ref={optionsRef[index]}
                onKeyDown={onItemKeyDown.bind(this, index)}
                aria-label={option.label}
                onMouseEnter={() => highlight(index)}
                onMouseLeave={() => highlight(null)}
              >
                <div className="option__select--label">
                  <span>{option.label}</span>
                  <Checked />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Select;
