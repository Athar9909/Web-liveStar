import axios from "axios";
import React, { useEffect, useState } from "react";
const Welcome = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nt, setNt] = useState(true);
  const getNotified = `${process.env.REACT_APP_APIENDPOINTNEW}user/addNotify`;
  
  const [countdownDate, setCountdownDate] = useState(
    new Date("02/8/2023").getTime()
  );
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setInterval(() => setNewTime(), 1000);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(getNotified, {
        name: name,
        email: email,
      })
      .then((res) => {
        if (!res.error) {
          setNt(!nt);
        }
      });
  };
  const setNewTime = () => {
    if (countdownDate) {
      const currentTime = new Date().getTime();

      const distanceToDate = countdownDate - currentTime;

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      days = `${days}`;
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      } else if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      } else if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }

      setState({ days: days, hours: hours, minutes, seconds });
    }
  };
  return (
    <div className="welcome">
      <>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid ">
            <a className="navbar-brand sidebar_logo p-4">
              <img src={require("../../assets/img/logo.png")} />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            />
          </div>
        </nav>
        <header id="header" className="d-flex align-items-center">
          <div className="container d-flex flex-column align-items-center">
            <h1>Coming Soon!</h1>
            <h2>Our new website is on its way.</h2>
            <div
              className="countdown d-flex justify-content-center"
              data-count="2023/1/1"
            >
              <div>
                <h3>{state.days || "0"}</h3>
                <h4>Days</h4>
              </div>
              <div>
                <h3>{state.hours || "00"}</h3>
                <h4>Hours</h4>
              </div>
              <div>
                <h3>{state.minutes || "00"}</h3>
                <h4>Minutes</h4>
              </div>
              <div>
                <h3>{state.seconds || "00"}</h3>
                <h4>Seconds</h4>
              </div>
            </div>
            <div className="social-links text-center">
              <a href="#" className="twitter">
                <i className="bi bi-twitter" />
              </a>
              <a href="#" className="facebook">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" className="instagram">
                <i className="bi bi-instagram" />
              </a>
            </div>
            <div className="mt-5">
              {

                nt ?
                <form className="form-design d-flex ">
                <input
                  type="text"
                  required=""
                  className="form-control rounded-0 shadow-none bg-white"
                  placeholder="Enter Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  required=""
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control rounded-0 shadow-none mx-4 bg-white"
                  placeholder="Enter Email Address"
                />
                <button
                  className="btn btn-dark rounded-0 w-100 border"
                  name="submit"
                  onClick={onSubmit}
                >
                  Get Notified
                </button>
              </form>
              :
              <div className="text-center text-success fw-bold">
               <i class="fa-solid fa-circle-check"></i> Your email has been submitted!
                </div>
              }
             
            </div>
          </div>
        </header>
        {/* End #header */}
        <footer id="footer">
          <div className="container">
            <div className="copyright">
              © Copyright{" "}
              <strong>
                <span>Star Importers</span>
              </strong>
              . All Rights Reserved
            </div>
          </div>
        </footer>
        <a
          href="#"
          className="back-to-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short" />
        </a>
      </>
    </div>
  );
};

export default Welcome;
