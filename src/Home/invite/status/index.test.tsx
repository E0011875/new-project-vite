import { fireEvent, render, screen } from "@testing-library/react";

import Status from "./index";
import { StatusDetails, SUBMIT_STATUS } from "../constants";

describe("Button", () => {
  it("should render without crashing", () => {
    render(<Status status={SUBMIT_STATUS.NONE} />);
    expect(screen.queryByTestId("status")).toBeTruthy();
  });
  it("should render success submit status", () => {
    const confirmHandler = jest.fn();
    render(
      <Status status={SUBMIT_STATUS.SUCCESS} onConfirm={confirmHandler} />
    );
    const status = screen.getByTestId("status");
    expect(status).toBeVisible();

    const { title, message, additional } = StatusDetails[SUBMIT_STATUS.SUCCESS];
    expect(status).toHaveTextContent(title);
    expect(status).toHaveTextContent(`${message}${additional}`);

    const button = screen.queryByTestId("button");
    fireEvent.click(button!);
    expect(confirmHandler).toHaveBeenCalled();
  });
  it("should render failure submit status", () => {
    const confirmHandler = jest.fn();
    render(
      <Status
        status={SUBMIT_STATUS.FAILED}
        onConfirm={confirmHandler}
        error="404"
      />
    );
    const status = screen.getByTestId("status");
    expect(status).toBeVisible();

    const { title, message, additional } = StatusDetails[SUBMIT_STATUS.FAILED];
    expect(status).toHaveTextContent(title);
    expect(status).toHaveTextContent(`${message}${additional}`);
    expect(status).toHaveTextContent("* 404");

    const button = screen.queryByTestId("button");
    fireEvent.click(button!);
    expect(confirmHandler).toHaveBeenCalled();
  });
  it("should not render status", () => {
    render(<Status status={SUBMIT_STATUS.NONE} />);
    expect(screen.getByTestId("status")).not.toBeVisible();
  });
});
