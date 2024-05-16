import logoImage from "../../images/storkyLogo.png";
import ThinkingImage from "../../images/Thinking-PNG.png";
import "./InstructorUser.css";
const UserMessage = () => {
  return (
    <div className="background-image">
      <div>
        <div className="container-users">
          <header className="logo-u">
            <img src={logoImage} alt="" />
          </header>
          <div>
            <img src={ThinkingImage} className="ThinkingImage" alt="" />
          </div>
          <div className="paragraph2">
            <p>
              You can not create an account. Your instructor would invite you by
              phone or email, and we will create the account for you
            </p>
          </div>
        </div>
        <footer>
          <p className="footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </footer>
      </div>
    </div>
  );
};
export default UserMessage;
