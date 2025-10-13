import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomeContentList from '@/components/sections/HomeContentList';
import TopBrands from '@/components/sections/TopBrands';
import TopItems from '@/components/sections/TopItems';
// import SimpleTest from '@/components/SimpleTest';
// import TestApi from '@/components/TestApi';
//import ContentDisplay from '@/components/sections/ContentDisplay';

export default function Home() {
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Simple React Query Test */}
        {/* <SimpleTest /> */}
        
        {/* API Test Component */}
        {/* <TestApi /> */}
        
        {/* Featured Content Section */}
        <HomeContentList />
        
        {/* Top Brands Section */}
        <TopBrands />
        
        {/* Top Items Section */}
        <TopItems />
        
        {/* Content Display Section */}
        {/* <ContentDisplay /> */}
      </main>
      
      <Footer />
    </div>
  );
}