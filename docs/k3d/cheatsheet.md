export KUBECONFIG=~/.kube/config
$ k3d kubeconfig merge hornex --kubeconfig-merge-default


change namespace
$ k config set-context --namespace=kube-system
