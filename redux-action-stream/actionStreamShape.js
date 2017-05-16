import React, {PropTypes} from 'react';

export default PropTypes.shape({
  on: PropTypes.func.isRequired,
  middleware: PropTypes.func.isRequired
})
