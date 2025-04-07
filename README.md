# Yaong 프로젝트
Yaong은 Twitch 및 Youtube와 같은 스트리밍 서비스이며, 직접 컨텐츠 서버를 운영 할 수 있는 프로젝트 입니다.

## 기여자
- 이재호(narumir) - Backend + Infra
- 김병기(ByeongGi) - FrontEnd
## 사용 기술 스택 및 사용 도구
### FrontEnd
- Next.js(React.js)
- React-Query
- TailwindCSS
### Backend
- Nest.js(Express.js)
- PostgreSQL,
- Redis
- Socket.io
### DevOps
- Kubernetes(On-Premise)
- AWS(CDN)
- Github Action
- ArogoCD
- OpenSearch + FluentBit
- Grafana + Prometheus

## 프로젝트 개요
잠을 자기 전, 출/퇴근과 같이 이동을 하면서 많은 사람들이 트위치나 유트부와 같은 플랫폼을 통해서 스트리머의 콘텐츠를 시청하고 웃으면서 생활을 활력을 얻고 있습니다.

하지만 네트워크 망 문제로 서비스를 480p로 시청하거나 그리드 시스템을 활용하여 트레픽을 분산하여 망 문제를 해결하고 있습니다. 하지만 이는 시청자가 많은 데이터를 사용하게 되고 네트워크가 원활하지 않은 경우 그리드 시스템에의해 시청이 제한되기도 합니다.

플랫폼은 하나이지만, 스트리머나 혹은 기업이 직접 컨텐츠 서버를 운영할 수 있도록 분산하여, 네트워크 망 문제를 해소하고 시청자가 불필요한 네트워크를 지출하는 것을 막을 수 있습니다.

## 프로젝트 진행 과정
### 모니터링 도구를 통한 시각화
홈 서버의 네트워크는 500mbps를 지원 하고 이를 기반으로 서버를 운영하고 있었습니다. 영상 콘텐츠를 운영하고 있기 때문에 대역폭이나 속도에 크게 민감 할 수 밖에 없었습니다. 그래서 Prometheus와 같은 모니터링 도구를 사용하여 컨테이너에서 사용하는 트레픽을 수집하여 Grafana를 통해서 시각화 하여 불필요한 트래픽이 발생하고 있는지 체크하면서 개발 및 운영을 할 수 있었습니디.

또한 OpenSearch와 fluentbit를 도입하여 서비스에서 오류나 로그를 확인하며 개발과 실제 운영간의 간격을 줄였습니다.

### 


