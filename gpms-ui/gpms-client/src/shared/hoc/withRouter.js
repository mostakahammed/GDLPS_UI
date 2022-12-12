import { useNavigate,useLocation,useParams  } from 'react-router-dom';

export const withRouter = (Component) => {
  
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const location=useLocation(); 
    const params=useParams();

    return (
      <Component navigate={navigate} location={location} useParams={params} {...props}/>
    );
  }; 

  return Wrapper;
};