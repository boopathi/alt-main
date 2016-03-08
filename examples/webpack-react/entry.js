import AltMain from 'alt-main';
import PackageJson from 'package-json';
import Index from 'index-js';
import CustomExtensionAltMain from 'custom-extension-alt-main';

import React from 'react';
import ReactDOM from 'react-dom';

const Checkbox = () => <input type='checkbox' checked='checked'/>;

ReactDOM.render(<ul>
  <li><Checkbox />{AltMain()}</li>
  <li><Checkbox />{PackageJson()}</li>
  <li><Checkbox />{Index()}</li>
  <li><Checkbox />{CustomExtensionAltMain()}</li>
</ul>, document.getElementById('react'));
