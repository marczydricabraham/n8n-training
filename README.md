Step #1: Create the docker-compose.yml
Step #2:  Create the db.json
Step #3: Start the your container by "docker compose up -d" , to verify if it is running "docker compose ps".
Step #4: Proceed to "http://localhost:5678" and complete your signup using your stratpoint email.
Step #5: Check the training materials and start your Day 1.

once done, this is how you verify if the new records were routed and written to db,json

"curl http://localhost:3001/crm" - for crm

"curl http://localhost:3001/analytics" - for analytics

--
