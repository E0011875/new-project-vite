import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./index";

describe("Button", () => {
  it("should render without crashing", () => {
    render(<Button label="My Button" />);
    expect(screen.queryByTestId("button")).toBeTruthy();
  });
  it("should render loading state", () => {
    render(<Button label="My Button" isLoading={true} />);
    expect(screen.queryByTestId("button")).toBeDisabled();
    expect(screen.queryByTestId("button-spinner")).toBeTruthy();
  });
  it("should render disabled state", () => {
    render(<Button label="My Button" disabled={true} />);
    expect(screen.queryByTestId("button")).toBeDisabled();
    expect(screen.queryByTestId("button-spinner")).toBeNull();
  });
  it("should fire event onClick", () => {
    const clickHandler = jest.fn();
    render(<Button label="My Button" onClick={clickHandler} />);
    const button = screen.queryByTestId("button");

    fireEvent.click(button!);
    expect(clickHandler).toHaveBeenCalled();
  });
  it("should not fire event onClick on disabled", () => {
    const clickHandler = jest.fn();
    render(<Button label="My Button" onClick={clickHandler} disabled={true} />);
    const button = screen.queryByTestId("button");

    fireEvent.click(button!);
    expect(clickHandler).not.toHaveBeenCalled();
  });
});
