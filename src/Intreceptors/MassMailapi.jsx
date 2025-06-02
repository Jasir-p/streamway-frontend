
import { addEmail } from "../redux/slice/EmailSlice";


export const MassMail = async (data, { userId, role, dispatch,showSuccess,showError }) => {
  if (role !== "owner") {
    data.sender = userId;
  }

  try {
    await dispatch(addEmail(data)).unwrap();
    showSuccess("Email sent successfully!");

  } catch (error) {
    console.error("Failed to send email:", error);
    showError("Failed to send email. Please try again.");
  }
};