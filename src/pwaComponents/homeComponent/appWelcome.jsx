import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "./appHeader";

function AppWelcome() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nt, setNt] = useState(true);
  const getNotified = `${process.env.REACT_APP_APIENDPOINTNEW}user/addNotify`;
  const [countdownDate, setCountdownDate] = useState(
    new Date("02/05/2023").getTime()
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
  return (
    <div className="star_imp_app">
      <AppHeader />
      <div className="load_position">
        <div class="loader_new"></div>
      </div>
    </div>
  );
}

export default AppWelcome;
