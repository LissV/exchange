import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { PROXY_URL, SOURCE_URL } from "./constants";
import ConvertForm from "./ConvertForm";

export default () => {
  const [getValue, setGetValue] = useState(0);
  const [currencyList, setCurrencyList] = useState([]);

  !localStorage.getItem("changeCurrency") &&
    localStorage.setItem("changeCurrency", "RUB");

  const getCurrencyList = (data) => {
    const list = [...data];
    const allCurrency = [];
    list.forEach((item) => {
      const firstCurrency = item.slice(0, 3);
      const secondCurrency = item.slice(3, item.length);
      allCurrency.push(firstCurrency);
      allCurrency.push(secondCurrency);
    });
    const currencyList = new Set(allCurrency);
    return currencyList;
  };

  async function getFullCurrencyList() {
    try {
      const response = await axios.get(`${PROXY_URL}/${SOURCE_URL}`, {
        params: {
          get: "currency_list",
          key: "001ff4238cd1adf089a572bab45724f4",
        },
      });

      if (response.statusText === "OK") {
        setCurrencyList(Array.from(getCurrencyList(response.data.data)));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    !currencyList.length && getFullCurrencyList();

    return localStorage.removeItem("getCurrency");
  }, []);

  return (
    <>
      <Container>
        <ConvertForm
          currencyList={currencyList}
          getValue={getValue}
          setGetValue={setGetValue}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 100px;
`;
