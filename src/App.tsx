import Geozone from "./Geozone/Geozone";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <Geozone />
    </div>
  );
};

export default App;
