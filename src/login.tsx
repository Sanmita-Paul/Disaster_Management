import './login.css'

function Header_login(){
  return(
    <>
      <div className='head_login'>
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Disaster Management</h1>
      </div>
    </>
  )
}

function login_box(){
  return(
    <div className="login-box">
      <br></br>
      <h2>Login</h2>
      <br></br>
      <form>
        <div className="user-box">
          <label className='email-box'>Email</label>&nbsp;&nbsp;
          <input type="email" name="email" required />
        </div>
        <div className="user-box">
          <label>Password</label>&nbsp;&nbsp;
          <input type="password" name="password" required />
        </div>
        <br></br>
        <button className="login-page-btn" type="submit">Submit</button>
      </form>
    </div>
  )
}
export function Login() {
  return(
    <div className='login-body'>
      {Header_login()}
      {login_box()}
    </div>
  )
}