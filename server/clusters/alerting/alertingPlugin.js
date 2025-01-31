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

import {
  MONITOR_BASE_API,
  DESTINATION_BASE_API,
  EMAIL_ACCOUNT_BASE_API,
  EMAIL_GROUP_BASE_API,
} from '../../services/utils/constants';

export default function alertingPlugin(Client, config, components) {
  const ca = components.clientAction.factory;

  Client.prototype.alerting = components.clientAction.namespaceFactory();
  const alerting = Client.prototype.alerting.prototype;

  alerting.getMonitor = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/<%=monitorId%>`,
      req: {
        monitorId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  alerting.createMonitor = ca({
    url: {
      fmt: `${MONITOR_BASE_API}?refresh=wait_for`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.deleteMonitor = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/<%=monitorId%>`,
      req: {
        monitorId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });

  alerting.updateMonitor = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/<%=monitorId%>?if_seq_no=<%=ifSeqNo%>&if_primary_term=<%=ifPrimaryTerm%>&refresh=wait_for`,
      req: {
        monitorId: {
          type: 'string',
          required: true,
        },
        ifSeqNo: {
          type: 'string',
          required: true,
        },
        ifPrimaryTerm: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'PUT',
  });

  alerting.getMonitors = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/_search`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.acknowledgeAlerts = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/<%=monitorId%>/_acknowledge/alerts`,
      req: {
        monitorId: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'POST',
  });

  alerting.getAlerts = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/alerts`,
    },
    method: 'GET',
  });

  alerting.executeMonitor = ca({
    url: {
      fmt: `${MONITOR_BASE_API}/_execute?dryrun=<%=dryrun%>`,
      req: {
        dryrun: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'POST',
  });

  alerting.getDestination = ca({
    url: {
      fmt: `${DESTINATION_BASE_API}/<%=destinationId%>`,
      req: {
        destinationId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  alerting.searchDestinations = ca({
    url: {
      fmt: `${DESTINATION_BASE_API}`,
    },
    method: 'GET',
  });

  alerting.createDestination = ca({
    url: {
      fmt: `${DESTINATION_BASE_API}?refresh=wait_for`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.updateDestination = ca({
    url: {
      fmt: `${DESTINATION_BASE_API}/<%=destinationId%>?if_seq_no=<%=ifSeqNo%>&if_primary_term=<%=ifPrimaryTerm%>&refresh=wait_for`,
      req: {
        destinationId: {
          type: 'string',
          required: true,
        },
        ifSeqNo: {
          type: 'string',
          required: true,
        },
        ifPrimaryTerm: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'PUT',
  });

  alerting.deleteDestination = ca({
    url: {
      fmt: `${DESTINATION_BASE_API}/<%=destinationId%>`,
      req: {
        destinationId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });

  alerting.getEmailAccount = ca({
    url: {
      fmt: `${EMAIL_ACCOUNT_BASE_API}/<%=emailAccountId%>`,
      req: {
        emailAccountId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  alerting.getEmailAccounts = ca({
    url: {
      fmt: `${EMAIL_ACCOUNT_BASE_API}/_search`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.createEmailAccount = ca({
    url: {
      fmt: `${EMAIL_ACCOUNT_BASE_API}?refresh=wait_for`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.updateEmailAccount = ca({
    url: {
      fmt: `${EMAIL_ACCOUNT_BASE_API}/<%=emailAccountId%>?if_seq_no=<%=ifSeqNo%>&if_primary_term=<%=ifPrimaryTerm%>&refresh=wait_for`,
      req: {
        emailAccountId: {
          type: 'string',
          required: true,
        },
        ifSeqNo: {
          type: 'string',
          required: true,
        },
        ifPrimaryTerm: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'PUT',
  });

  alerting.deleteEmailAccount = ca({
    url: {
      fmt: `${EMAIL_ACCOUNT_BASE_API}/<%=emailAccountId%>`,
      req: {
        emailAccountId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });

  alerting.getEmailGroup = ca({
    url: {
      fmt: `${EMAIL_GROUP_BASE_API}/<%=emailGroupId%>`,
      req: {
        emailGroupId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  alerting.getEmailGroups = ca({
    url: {
      fmt: `${EMAIL_GROUP_BASE_API}/_search`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.createEmailGroup = ca({
    url: {
      fmt: `${EMAIL_GROUP_BASE_API}?refresh=wait_for`,
    },
    needBody: true,
    method: 'POST',
  });

  alerting.updateEmailGroup = ca({
    url: {
      fmt: `${EMAIL_GROUP_BASE_API}/<%=emailGroupId%>?if_seq_no=<%=ifSeqNo%>&if_primary_term=<%=ifPrimaryTerm%>&refresh=wait_for`,
      req: {
        emailGroupId: {
          type: 'string',
          required: true,
        },
        ifSeqNo: {
          type: 'string',
          required: true,
        },
        ifPrimaryTerm: {
          type: 'string',
          required: true,
        },
      },
    },
    needBody: true,
    method: 'PUT',
  });

  alerting.deleteEmailGroup = ca({
    url: {
      fmt: `${EMAIL_GROUP_BASE_API}/<%=emailGroupId%>`,
      req: {
        emailGroupId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });
}
