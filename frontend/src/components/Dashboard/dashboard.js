import QueryForm from './QueryForm';
import UserSchema from './UserSchema';


const Dashboard = () => {
    
    const containerStyle = {
        display: 'flex',
      };
    
      const componentAStyle = {
        flex: '0 0 20%',
        backgroundColor: '#333',
      };
    
      const componentBStyle = {
        flex: '1', 
      };
    
      return (
        <div style={containerStyle}>
          <div style={componentAStyle}>
            <UserSchema />
          </div>
          <div style={componentBStyle}>
            <QueryForm />
          </div>
        </div>
      );
    };
    
export default Dashboard;







