#!/usr/bin/env sh

# Replace "REACT_APP*" environment variables in the static files
# Way faster than compiling it again, maybe there are better solutions but should be good enough for now

appDir=/usr/share/nginx/html/

REACT_VARS=$(printenv | sed 's;=.*;;' | sort | grep '^REACT_APP')

echo "Replacing env vars: $REACT_VARS"

st=$(date +%s%N)

# e.g. "$REACT_APP_API_URL" anywhere in the static files is replaced with "REACT_APP_API_URL" environment variable
printenv | grep '^REACT_APP' | sed 's;=.*;;' | \
 xargs -I@ find $appDir -type f -exec sh -c 'var=$@; sed -i 's/[$]@/'"$var"'/g' {}' \;

et=$((($(date +%s%N) - $st)/1000000))
echo "Replaced variables in $et milliseconds"

exec nginx -g 'daemon off;'
