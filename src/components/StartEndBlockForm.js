import React from 'react';
import PropTypes from 'prop-types'; 

/* Input validation with Formik library and Yup */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import BlockInput from './BlockInput';
import GenerateButton from './buttons/GenerateButton';


const StartEndBlockForm = (props) => {

  return (
    <Formik
      // Definition of initial values
      initialValues={{
        startblock: 0,
        endblock: 0,
      }}

      // 'Ensures that form values can be dynamically injected, e.g. from an API (not really needed in this case)
      enableReinitialize

      // Schema to validate input fields and their error messages;
      validationSchema = {
        Yup.object({
          startblock: Yup.number('Please enter a valid number.')
            .integer('Please enter a valid number.')
            .min(0, 'Must be greater or equal to 0.')
            .required('This field is required.'),
          endblock: Yup.number('Please enter a valid number.')
            .integer('Please enter a valid number.')
            .min(Yup.ref('startblock'), 'Must be greater or equal to start block')
            .when('startblock', (startblock, schema) => {
                return schema.max(startblock + 150, 'Maximum block range is currently 150 blocks');
            })
            .required('This field is required.')
      })}

      // Function invoked when form submitted (by clicking on the generate button)
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // Disable button, make loader appear
        await props.setFetching(true);

        // Finish cycle
        setSubmitting(false);

        // Reset form
        // resetForm();

        props.onSubmit(values.startblock, values.endblock);
      }}>


      {({ isValid }) => (

        <Form className="flex flex-col justify-center p-0 m-0 space-y-4 flex-nowrap">

        {/* Start block */}
        <div className="w-full flex flex-row justify-center items-center space-x-4">
          <div className="text-gray-600 text-center text-base font-semibold w-28">
            Start block
          </div>
          <BlockInput
            label="Start block"
            name="startblock"
            type="number"
            autoFocus
          />
        </div>

        {/* End block */}
        <div className="w-full flex flex-row justify-center items-center space-x-4">
          <div className="text-gray-600 text-center text-base font-semibold w-28">
            End block
          </div>
          <BlockInput
            label="End block"
            name="endblock"
            type="number"
          />
        </div>

        <br/>

        {/* Generate Button */}
        <GenerateButton
          onClick={() => null}
          isValid={isValid}
          lock={props.buttonLock}
        />

        </Form>
      )}
    </Formik>
  );
};

StartEndBlockForm.propTypes = {
  setFetching: PropTypes.func.isRequired,
  buttonLock: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default StartEndBlockForm;