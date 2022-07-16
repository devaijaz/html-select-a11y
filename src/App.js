import Select from "./component/Select";
import "./App.css";
const options = Object.freeze([
  {
    label: "JavaScript",
    value: "JS"
  },
  {
    label: "ReactJS",
    value: "react"
  },
  {
    label: "Spring Boot",
    value: "springboot"
  },
  {
    label: "Python Programming",
    value: "python"
  }
]);

export default function App() {
  return (
    <div className="App">
      {/* <h4>Custom</h4>
      <Select
        label="Select an Option..."
        options={options}
        value="python"
        renderItem={(option, recommendedProps, isSelected) => {
          return (
            <div
              {...recommendedProps}
              className={`custom_list_item ${recommendedProps.className}`}
            >
              <span>{option.label}</span>
              {isSelected && <Checked />}
            </div>
          );
        }}
        onChange={(newValue) => {
          console.log(newValue);
        }}
      /> */}

      <h4>Default</h4>
      <Select value="react" label="Select an Option..." options={options} />
    </div>
  );
}
