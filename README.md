# action aws ssm to dotenv
![](https://github.com/deptno/action-aws-ssm-to-dotenv/workflows/v1/badge.svg)

create `.env` or **shell script** via AWS SSM parameters path

## usage

```yaml
- uses: deptno/action-aws-ssm-to-dotenv@v1.2.0
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }} # required
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # required
    AWS_DEFAULT_REGION: ap-northeast-2 # required
  with:
    ssm-path: /opensource/action-aws-ssm-to-dotenv # required
    format: shell
    output: .env.development
    prefix: SSM_
    decryption: true
```

## option

### ssm-path(required)
AWS Systems Manager > Parameter Store > Path

### format(default `dotenv`)
optional, default=dotenv  
  - dotenv: KEY="value" (default)
  - shell: export KEY="value"  
  - yaml: KEY: "value" 
  
### output(default `.env`)
output filename

### prefix(optional)
add prefix to exported variable name  
eg) `prefix: ACTION_` will export `ACTION_ENV_VAR="value"`

### decryption(optional)
should parameters be decrypted?

[.github/workflows/test.yml](.github/workflows/test.yml)

---
### License
MIT
