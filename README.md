# action aws ssm to dotenv
![](https://github.com/deptno/action-aws-ssm-to-dotenv/workflows/test/badge.svg)
![](https://github.com/deptno/action-aws-ssm-to-dotenv/workflows/v0/badge.svg)

create `.env` via AWS SSM parameters path

## usage

```yaml

- uses: deptno/action-aws-ssm-to-dotenv
  env:
    # required
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    # required
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    # required
    AWS_DEFAULT_REGION: ap-northeast-2
  with:
    # required, default=dotenv
    ssm-path: /opensource/action-aws-ssm-to-dotenv
    # optional, default=dotenv
    # - default dotenv: KEY="value"
    # -         shell:  export KEY="value"  
    format: shell 
    # optional, default ".env"
    output: .env.development
    # optional, export environment variable with specific prefix
    # eg) `prefix: ACTION_` will exports `ACTION_ENV_VAR="value"`
    prefix: SSM_
```

[.github/workflows/test.yml](.github/workflows/test.yml)

---

MIT
