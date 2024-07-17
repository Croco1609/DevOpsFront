import CategorysPage from '../../Components/CategorysPage/CategorysPage'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../../Components/Footer/Footer'

export default function Category() {
  return (
    <div className="mainDiv">
      <NavBar />
      <div className='main-container'>
        <CategorysPage />
      </div>
      <Footer/>
    </div>
  )
}
