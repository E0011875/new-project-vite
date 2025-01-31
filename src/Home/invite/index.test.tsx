import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Invite from "./index";
import { RecoilRoot } from "recoil";
import { registeredAccountSelector } from "../../recoil/selectors";
import * as Utils from "../../utils";
import { StatusDetails, SUBMIT_STATUS } from "./constants";

describe("Invite", () => {
  const wrapper: React.JSXElementConstructor<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <RecoilRoot
      initializeState={(snap) =>
        snap.set(registeredAccountSelector("testuser3@example.com"), {
          fullName: "Test User 3",
          email: "testuser3@example.com",
        })
      }
    >
      {children}
    </RecoilRoot>
  );

  it("should render without crashing", () => {
    render(<Invite />, { wrapper });
    expect(screen.queryByTestId("modal")).toBeTruthy();
  });
  it("should open modal on request invite", () => {
    render(<Invite />, { wrapper });
    expect(screen.getByTestId("modal")).not.toBeVisible();
    const invite = screen.getAllByTestId("button")[0];

    fireEvent.click(invite);
    expect(screen.getByTestId("modal")).toBeVisible();
    expect(screen.getByTestId("form")).toBeVisible();

    const close = screen.getByTestId("close");
    fireEvent.click(close);
    expect(screen.getByTestId("modal")).not.toBeVisible();
  });
  it("should show error message on invalid full name", async () => {
    render(<Invite />, { wrapper });
    const invite = screen.getAllByTestId("button")[0];
    fireEvent.click(invite);

    const fullNameInput = screen.getByPlaceholderText("Full name");
    fireEvent.change(fullNameInput, { target: { value: "Te" } });
    const submit = screen.getAllByTestId("button")[1];
    fireEvent.submit(submit);

    await waitFor(() =>
      expect(screen.queryByTestId("modal")).toHaveTextContent(
        "* Full name must be at least 3 characters long"
      )
    );
  });
  it("should show error message on invalid email", async () => {
    render(<Invite />, { wrapper });
    const invite = screen.getAllByTestId("button")[0];
    fireEvent.click(invite);

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    const submit = screen.getAllByTestId("button")[1];
    fireEvent.submit(submit);

    await waitFor(() =>
      expect(screen.queryByTestId("modal")).toHaveTextContent(
        "* Invalid email format"
      )
    );
  });
  it("should show error message on invalid confirm email", async () => {
    render(<Invite />, { wrapper });
    const invite = screen.getAllByTestId("button")[0];
    fireEvent.click(invite);

    const emailInput = screen.getByPlaceholderText("Email");
    const confirmEmailInput = screen.getByPlaceholderText("Confirm email");
    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(confirmEmailInput, {
      target: { value: "testuser1@example.com" },
    });

    const submit = screen.getAllByTestId("button")[1];
    fireEvent.submit(submit);

    await waitFor(() =>
      expect(screen.queryByTestId("modal")).toHaveTextContent(
        "* Emails do not match"
      )
    );
  });
  it("should show error message on already registered email", async () => {
    render(<Invite />, { wrapper });
    const invite = screen.getAllByTestId("button")[0];
    fireEvent.click(invite);
    expect(screen.getByTestId("modal")).toBeVisible();

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, {
      target: { value: "testuser3@example.com" },
    });
    const submit = screen.getAllByTestId("button")[1];
    fireEvent.submit(submit);

    await waitFor(() =>
      expect(screen.queryByTestId("modal")).toHaveTextContent(
        "* Email already registered"
      )
    );
  });
  it("should submit successfully", async () => {
    jest.spyOn(Utils, "fetchPost").mockResolvedValue({
      name: "Test User 4",
      email: "testuser4@example.com",
    });

    render(<Invite />, { wrapper });
    const invite = screen.getAllByTestId("button")[0];
    fireEvent.click(invite);

    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("Email");
    const confirmEmailInput = screen.getByPlaceholderText("Confirm email");
    fireEvent.change(fullNameInput, { target: { value: "Test User 4" } });
    fireEvent.change(emailInput, {
      target: { value: "testuser4@example.com" },
    });
    fireEvent.change(confirmEmailInput, {
      target: { value: "testuser4@example.com" },
    });

    const submit = screen.getAllByTestId("button")[1];
    fireEvent.submit(submit);
    await waitFor(() => {
      expect(screen.getByTestId("form")).not.toBeVisible();
    });

    const status = screen.getByTestId("status");
    expect(status).toBeVisible();

    const { title, message, additional } = StatusDetails[SUBMIT_STATUS.SUCCESS];
    expect(status).toHaveTextContent(title);
    expect(status).toHaveTextContent(`${message}${additional}`);

    const gotIt = screen.getAllByTestId("button")[2];
    fireEvent.click(gotIt);
    expect(screen.getByTestId("modal")).not.toBeVisible();
  });
});
