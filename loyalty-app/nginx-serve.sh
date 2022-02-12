#!/usr/bin/env sh

# Replace "REACT_APP*" environment variables in the static files
# Way faster than compiling it again, maybe there are better solutions but should be good enough for now

appDir=/usr/share/nginx/html/

REACT_VARS=$(printenv | sed 's;=.*;;' | sort | grep '^REACT_APP')

echo "Replacing env vars: $REACT_VARS"

cd $(mktemp -d)
cp -rpf $appDir .
cd html

# e.g. "$REACT_APP_API_URL" anywhere in the static files is replaced with "REACT_APP_API_URL" environment variable
# First greps REACT_APP* env vars, joins with ",\$" then it finds all files in the temp dir and calls envsubst with them (\$var1,\$var2)
# and saves the new file in the nginx public dir
printenv | grep '^REACT_APP' | sed 's;=.*;;' | paste -sd ",\$" - | xargs -I@ find * -type f -exec sh -c "envsubst '\$"@"' < {} > $appDir{}" \;

echo "Replaced variables"

exec nginx -g 'daemon off;'
