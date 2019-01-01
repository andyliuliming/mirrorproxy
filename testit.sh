#!/bin/bash
npm run mock_k8s_api_server
npm run mock_k8s_kubelet

npm run end_proxy

npm run front_proxy