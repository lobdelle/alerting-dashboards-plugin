/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 *   Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import React from 'react';
import { Formik } from 'formik';
import { mount } from 'enzyme';

import { FORMIK_INITIAL_VALUES } from '../CreateMonitor/utils/constants';
import MonitorIndex from './MonitorIndex';
import * as helpers from './utils/helpers';
import { httpClientMock } from '../../../../../test/mocks';

helpers.createReasonableWait = jest.fn((cb) => cb());
httpClientMock.post.mockResolvedValue({ ok: true, resp: [] });

// Enzyme's change event is synchronous and Formik's handlers are asynchronous
// https://github.com/formium/formik/issues/937, https://www.benmvp.com/blog/asynchronous-testing-with-enzyme-react-jest/
const runAllPromises = () => new Promise(setImmediate);

function getMountWrapper(customProps = {}) {
  return mount(
    <Formik initialValues={FORMIK_INITIAL_VALUES}>
      {() => <MonitorIndex httpClient={httpClientMock} {...customProps} />}
    </Formik>
  );
}

describe('MonitorIndex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders', () => {
    const wrapper = getMountWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  test('calls onSearchChange when changing input value', () => {
    const onSearchChange = jest.spyOn(MonitorIndex.prototype, 'onSearchChange');
    const wrapper = getMountWrapper();
    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: 'random-index' } });

    expect(onSearchChange).toHaveBeenCalled();
    expect(onSearchChange).toHaveBeenCalledWith('random-index', false);
  });

  test('appends wildcard when search is one valid character', () => {
    const wrapper = getMountWrapper();

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: 'r' } });

    expect(wrapper.find(MonitorIndex).instance().state.appendedWildcard).toBe(true);
    expect((wrapper.find(MonitorIndex).instance().lastQuery = 'r*'));
  });

  test('searches space normalizes value', () => {
    const wrapper = getMountWrapper();

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: ' ' } })
      .simulate('keyDown', { key: 'Enter' });

    expect(wrapper.find('.euiComboBoxPill')).toHaveLength(0);
  });

  test('searches resets appendedWildcard', () => {
    const wrapper = getMountWrapper();

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: 'r' } });

    expect(wrapper.find(MonitorIndex).instance().state.appendedWildcard).toBe(true);
    expect((wrapper.find(MonitorIndex).instance().lastQuery = 'r*'));

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: '*' } });

    expect(wrapper.find(MonitorIndex).instance().state.appendedWildcard).toBe(false);
    expect((wrapper.find(MonitorIndex).instance().lastQuery = ''));
  });

  test('returns empty alias/index array for *:', async () => {
    const wrapper = getMountWrapper();

    expect(await wrapper.find(MonitorIndex).instance().handleQueryAliases('*:')).toEqual([]);
    expect(await wrapper.find(MonitorIndex).instance().handleQueryIndices('*:')).toEqual([]);
  });

  test('returns empty array for data.ok = false', async () => {
    httpClientMock.post.mockResolvedValue({ ok: false });
    const wrapper = getMountWrapper();

    expect(await wrapper.find(MonitorIndex).instance().handleQueryAliases('random')).toEqual([]);
    expect(await wrapper.find(MonitorIndex).instance().handleQueryIndices('random')).toEqual([]);
  });
  //
  test('returns indices/aliases', async () => {
    httpClientMock.post.mockResolvedValue({
      ok: true,
      resp: [{ health: 'green', status: 'open', index: 'logstash-0', alias: 'logstash' }],
    });
    const wrapper = getMountWrapper();

    expect(await wrapper.find(MonitorIndex).instance().handleQueryAliases('l')).toEqual([
      { label: 'logstash', index: 'logstash-0' },
    ]);
    expect(await wrapper.find(MonitorIndex).instance().handleQueryIndices('l')).toEqual([
      { health: 'green', status: 'open', label: 'logstash-0' },
    ]);
  });

  test.skip('onBlur sets index to touched', () => {
    httpClientMock.post.mockResolvedValue({
      ok: true,
      resp: [{ health: 'green', status: 'open', index: 'logstash-0', alias: 'logstash' }],
    });
    const wrapper = getMountWrapper();

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: 'l' } })
      .simulate('blur');

    expect(wrapper.instance().state.touched).toEqual({ index: true });
  });

  test('sets option when calling onCreateOption', async () => {
    httpClientMock.post.mockResolvedValue({
      ok: true,
      resp: [{ health: 'green', status: 'open', index: 'logstash-0', alias: 'logstash' }],
    });
    const wrapper = getMountWrapper();

    wrapper
      .find('[data-test-subj="comboBoxSearchInput"]')
      .hostNodes()
      .simulate('change', { target: { value: 'logstash-0' } });

    await runAllPromises();

    wrapper
      .find('[data-test-subj="comboBoxInput"]')
      .hostNodes()
      .simulate('keyDown', { key: 'ArrowDown' })
      .simulate('keyDown', { key: 'Enter' });

    // Validate the specific index is in the input field
    expect(wrapper.find('[data-test-subj="comboBoxInput"]').text()).toEqual('logstashEuiIconMock');
  });
});
