import './App.css'
import { FooterProvider } from './context/FooterContext';
import { UserProvider, useUser } from './context/UserContext';
import { TileRoutes } from './routers/route';

function App() {

      
  return (
    <UserProvider>
      <FooterProvider>
       <TileRoutes/>
     </FooterProvider>
   </UserProvider>
  );
}

export default App
