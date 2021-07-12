import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Form, Field } from "react-final-form";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { PROXY_URL, SOURCE_URL } from "./constants";
import validate from './validate';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
  },
}));

export default ({ currencyList, getValue, setGetValue }) => {
  const classes = useStyles();

  const getNewCurrency = async (query) => {
    try {
      const response = await axios.get(`${PROXY_URL}/${SOURCE_URL}`, {
        params: {
          get: "rates",
          pairs: query.pair,
          key: "001ff4238cd1adf089a572bab45724f4",
        },
      });
      if (response.statusText === "OK") {
        const newValue = response.data.data[query.pair];
        setGetValue(query.value * newValue);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (values) => {
    getNewCurrency({
      pair: values.changeCurrency + values.getCurrency,
      value: values.changeValue,
    });
  };

  const initialData = {
    changeCurrency: localStorage.getItem("changeCurrency"),
    changeValue: 1,
    getValue: getValue,
    getCurrency: localStorage.getItem("getCurrency"),
  };

  const swapCurrency = (mutators, currentValue, getValue) => {
    mutators.setValue("changeCurrency", getValue);
    localStorage.setItem("changeCurrency", getValue);
    mutators.setValue("getCurrency", currentValue);
    localStorage.setItem("getCurrency", currentValue);
    mutators.setValue("changeValue", 1);
    mutators.setValue("getValue", null);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={initialData}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={validate}
      >
        {({ handleSubmit, values, form }) => (
          <FormWrapper>
            <FormContainer>
              <FormBlock>
                <FormBlockTitle>Меняю</FormBlockTitle>
                <FieldsBlock>
                  <Field name="changeValue">
                    {(props) => (
                      <div>
                        <TextField
                          name={props.input.name}
                          value={props.input.value}
                          onChange={props.input.onChange}
                          label="Меняю"
                          variant="outlined"
                          error={!!props.meta.error}
                        />
                      </div>
                    )}
                  </Field>

                  <Field name="changeCurrency">
                    {(props) => (
                      <CurrecyFieldWrapper>
                        <CurrecyField
                          name={props.input.name}
                          value={props.input.value}
                          onChange={(e) => {
                            props.input.onChange(e.target.value);
                            localStorage.setItem(e.target.name, e.target.value);
                          }}
                          label="Валюта"
                          variant="outlined"
                          select
                        >
                          {currencyList.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </CurrecyField>
                      </CurrecyFieldWrapper>
                    )}
                  </Field>
                </FieldsBlock>
              </FormBlock>

              <FormBlock withButton>
                <IconButton
                  disabled={!values.getCurrency}
                  onClick={() =>
                    swapCurrency(
                      form.mutators,
                      values.changeCurrency,
                      values.getCurrency
                    )
                  }
                >
                  <SwapHorizIcon fontSize="large" />
                </IconButton>
              </FormBlock>

              <FormBlock>
                <FormBlockTitle>Получаю</FormBlockTitle>
                <FieldsBlock>
                  <Field name="getValue">
                    {(props) => (
                      <div>
                        <TextField
                          name={props.input.name}
                          value={props.input.value}
                          onChange={props.input.onChange}
                          label="Получаю"
                          variant="outlined"
                        />
                      </div>
                    )}
                  </Field>

                  <Field name="getCurrency">
                    {(props) => (
                      <CurrecyFieldWrapper>
                        <CurrecyField
                          name={props.input.name}
                          value={props.input.value}
                          onChange={(e) => {
                            props.input.onChange(e.target.value);
                            localStorage.setItem(e.target.name, e.target.value);
                          }}
                          label="Валюта"
                          variant="outlined"
                          select
                        >
                          {currencyList.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </CurrecyField>
                      </CurrecyFieldWrapper>
                    )}
                  </Field>
                </FieldsBlock>
              </FormBlock>
            </FormContainer>
            <Button
              disabled={!values?.getCurrency || !values?.changeValue}
              className={classes.root}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Конвертировать
            </Button>
          </FormWrapper>
        )}
      </Form>
    </>
  );
};

const CurrecyFieldWrapper = styled.div`
  margin-left: 15px;
`;

const CurrecyField = styled(TextField)`
  width: 100px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled.div`
  display: flex;
`;

const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ withButton }) => withButton && "flex-end"};
`;

const FieldsBlock = styled.div`
  display: flex;
`;

const FormBlockTitle = styled.div`
  color: gray;
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  margin-bottom: 15px;
`;
