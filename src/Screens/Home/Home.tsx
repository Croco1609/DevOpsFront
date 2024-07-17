import CategorysHome from '../../Components/CategorysHome/CategorysHome';
import NavBar from '../../Components/NavBar/NavBar';
import QuoiDeNeuf from '../../Components/QuoiDeNeuf/QuoiDeNeuf';
import HomeBanner from '../../Components/HomeBanner/HomeBanner';
import Footer from '../../Components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="mainDiv">
      <NavBar />
      <div className='main-container'>
        <HomeBanner/>
        <QuoiDeNeuf />
      </div>
      <div>
        <CategorysHome />
      </div>
      <Footer/>
    </div>
  )
}
