import { redirect } from "react-router-dom";

// Redirect to Dashboard
const Index = () => {
  // This component won't be used since we redirect to Dashboard
  // But kept for compatibility
  redirect("/");
  return null;
};

export default Index;
