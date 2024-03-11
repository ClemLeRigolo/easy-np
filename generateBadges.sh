#!/bin/bash

cypress="cypress_report.txt"

# Bash file that read cypress_report.txt
# and generate badges

number_to_color() {
  local number=$1
  if [[ $number -lt 50 ]]
  then
    echo "red";
    return;
  fi
  if [[ $number -lt 75 ]]
  then
    echo "orange";
    return;
  fi
  if [[ $number -lt 85 ]]
  then
    echo "lightgreen"
    return;
  fi
  echo "green";
}

extract() {
  if grep -q "All specs passed!" "$cypress"
  then
    passed="100"
  else
    failure=$(grep -Eo "[[:digit:]]+%" "$cypress"| tr -d '%')
    failure="75"
    passed=$((100 - failure))
    echo "$passed"
  fi
  color=$(number_to_color "$passed")
  echo $color
  anybadge -o -l "TESTS" -v "$passed%" -c "$color" -f "tests.svg"
}

if [ -f $cypress ]
then
  extract
else
  anybadge -o -l "TESTS" -v "Failed to start" -c "red" -f "tests.svg"
fi
