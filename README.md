# action aws ssm to dotenv
![](https://github.com/deptno/action-aws-ssm-to-dotenv/workflows/test/badge.svg)
![](https://github.com/deptno/action-aws-ssm-to-dotenv/workflows/v0/badge.svg)

create `.env` via AWS SSM parameters path

## inputs
ssm-paths: **required** `/ssm/paramters/path`  
format: **dotenv** | shell
  - dotenv: `KEY=value` **default**
  - shell: `export KEY=value`  
output: `.env` **default**  
prefix: set environment prefix, `ACTION_` // ssm:/dev/client_id -> ACTION_CLIENT_ID'  

## env
AWS_ACCESS_KEY_ID: **required**  
AWS_SECRET_ACCESS_KEY: **required**  
AWS_DEFAULT_REGION: **required**  

## usage

```yaml

- uses: deptno/action-aws-ssm-to-dotenv
  with:
    ssm-path: /opensource/action-aws-ssm-to-dotenv
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: ap-northeast-2
```

[.github/workflows/test.yml](.github/workflows/test.yml)

---

MIT
