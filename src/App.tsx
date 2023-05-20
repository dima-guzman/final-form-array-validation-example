import { setIn } from "final-form";
import arrayMutators from "final-form-arrays";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import * as yup from "yup";
import "./App.css";

const validationSchema = yup.object({
  questions: yup
    .array()
    .of(
      yup.object().shape({
        question: yup.string().required(),
      })
    )
    .test("At least one question required", (values: any) => !!values?.length),
});

const validateFormValues = (schema: yup.AnySchema) => async (values: any) => {
  try {
    await schema.validate(values, { abortEarly: false });
  } catch (err: any) {
    const errors = err.inner.reduce((formError: any, innerError: any) => {
      return setIn(formError, innerError.path, innerError.message);
    }, {});

    return errors;
  }
};

const validate = validateFormValues(validationSchema);

function App() {
  function aCustomSubmitFunction() {}

  return (
    <div className="App">
      <Form
        onSubmit={aCustomSubmitFunction}
        validate={validate}
        mutators={{ ...arrayMutators }}
      >
        {({ handleSubmit, errors }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field name="firstName">
                {({ input }) => <input {...input} />}
              </Field>
              <Field name="lastName">
                {({ input }) => <input {...input} />}
              </Field>
              <FieldArray name="questions">
                {({ fields }) => (
                  <div>
                    {fields.map((name, index) => {
                      return (
                        <div className="card" key={index}>
                          <Field name={`${name}.question`}>
                            {({ input }) => <input {...input} type="text" />}
                          </Field>
                          <button
                            type="button"
                            onClick={() => fields.remove(index)}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => fields.push({ question: undefined })}
                    >
                      Add a Question
                    </button>
                  </div>
                )}
              </FieldArray>
              <button type="submit">Submit</button>
              {JSON.stringify(errors)}
            </form>
          );
        }}
      </Form>
    </div>
  );
}

export default App;
