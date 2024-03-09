import React, { useEffect, useReducer } from "react";
import "./style.css";
import {
  FaEnvelopeOpen,
  FaUser,
  FaCalendarTimes,
  FaMap,
  FaPhone,
  FaLock,
} from "react-icons/fa";
const url = "https://randomuser.me/api/";
const defaultImage =
  "https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249_1280.png";

const initialState = {
  loading: true,
  person: null,
  title: "name",
  value: "random person",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "RANDOM_PERSON":
      const {
        email,
        dob: { age },
        name: { first, last },
        phone,
        picture: { thumbnail, large },
        location: {
          street: { name },
        },
        login: { password },
      } = action.payload;

      const personObj = {
        email,
        age,
        name: `${first} ${last}`,
        street: name,
        phone,
        password,
        image: large,
      };
      console.log(personObj);
      return {
        ...state,
        person: personObj,
        value: `${first} ${last}`,
        loading: false,
        title: "name",
      };

    case "LOADER":
      return { ...state, loading: action.payload };

    case "VALUE_CHANGER":
      return {
        ...state,
        title: action.payload,
        value: state.person[action.payload],
      };
    default:
      break;
  }
};
const RandomUser = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const iconArray = [
    { id: 1, mainClass: "icon", dataLabel: "name", iconName: <FaUser /> },
    {
      id: 2,
      mainClass: "icon",
      dataLabel: "email",
      iconName: <FaEnvelopeOpen />,
    },
    {
      id: 3,
      mainClass: "icon",
      dataLabel: "age",
      iconName: <FaCalendarTimes />,
    },
    { id: 4, mainClass: "icon", dataLabel: "street", iconName: <FaMap /> },
    { id: 5, mainClass: "icon", dataLabel: "phone", iconName: <FaPhone /> },
    { id: 6, mainClass: "icon", dataLabel: "password", iconName: <FaLock /> },
  ];

  const getPerson = async () => {
    dispatch({ type: "LOADER", payload: true });
    try {
      const res = await fetch(url);
      const data = await res.json();
      dispatch({ type: "RANDOM_PERSON", payload: data.results[0] });
    } catch (error) {
      dispatch({ type: "LOADER", payload: false });
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("hello");
    getPerson();
  }, []);

  const handleValue = (e) => {
    if (e.target.classList.contains("icon")) {
      const newVal = e.target.dataset.label;
      dispatch({ type: "VALUE_CHANGER", payload: newVal });
    }
  };
  return (
    <main>
      <section className="block bcg-black"></section>
      <section className="block">
        <div className="container">
          <img
            src={(state.person && state.person.image) || defaultImage}
            alt="random user"
            className="user-img"
          />
          <p className="user-title">my {state.title} is</p>
          <p className="user-value">{state.value}</p>
          <div className="values-list">
            {iconArray.map((icon) => {
              const { id, mainClass, dataLabel, iconName } = icon;
              return (
                <button
                  key={id}
                  data-label={dataLabel}
                  className={mainClass}
                  onMouseOver={handleValue}
                >
                  {iconName}
                </button>
              );
            })}
          </div>
          <button className="btn" type="button" onClick={getPerson}>
            {state.loading ? "loading..." : "random user"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default RandomUser;
