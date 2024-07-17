import FaqComponent from "../../Components/Faq/FaqComponent";
import NavBar from "../../Components/NavBar/NavBar";
import './Faq.css';
import Footer from "../../Components/Footer/Footer";

export default function Faq() {
  return (
    <div>
      <NavBar />
      <div>
        <FaqComponent />
      </div>
      <Footer/>
    </div>

  )
}
