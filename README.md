======================================================================
               N8N WORKFLOW AUTOMATION TRAINING SETUP
                     (FOUNDATION & WEEK 1 GUIDE)
======================================================================

OVERVIEW
----------------------------------------------------------------------
This training environment provides a fully sandboxed n8n workspace 
paired with a local Mock API container. You will build and test end-to-end 
automation workflows featuring webhook ingestion, array splitting, data 
normalization, conditional routing, and HTTP API integrations.


1. ARCHITECTURE & LOCAL ENVIRONMENT
----------------------------------------------------------------------
The environment uses Docker Compose to orchestrate two containers:

* n8n Engine:      http://localhost:5678 (Workflow Editor)
* Mock API Server: http://localhost:3001 (Simulated CRM & Analytics)

Container Inter-Communication:
n8n reaches the Mock API container using the host binding:
http://host.docker.internal:3001


2. PREREQUISITES
----------------------------------------------------------------------
* Docker Desktop (v20+ with Docker Compose v2)
* Terminal / CLI with cURL installed
* VS Code (or your preferred editor)
* Available host ports: 5678 and 3001


3. FILE DIRECTORY STRUCTURE
----------------------------------------------------------------------
Ensure your repository folder is structured as follows:

n8n_training/
├── docker-compose.yml              # Container orchestration setup
├── db.json                         # Seed database & storage for Mock API
├── payloads/                       # Test payload files
│   ├── users-corporate-public.json # 2-user test payload
│   └── users-batch-mixed.json      # 4-user mixed domain test payload
└── README.txt                      # Setup and environment guide


4. STEP-BY-STEP ENVIRONMENT SETUP
----------------------------------------------------------------------
Step 1: Create docker-compose.yml
---------------------------------
Place the following inside docker-compose.yml:

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - GENERIC_TIMEZONE=Asia/Manila
      - TZ=Asia/Manila
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/workflows

  mock-api:
    image: node:22-alpine
    container_name: mock-api
    restart: unless-stopped
    working_dir: /data
    volumes:
      - ./:/data
    ports:
      - "3001:3001"
     command: npx json-server@0.17.4 --watch db.json --port 3001

volumes:
  n8n_data:


Step 2: Create Baseline db.json
-------------------------------
Place the following seed structure inside db.json:

{
  "users": [
    { "id": "1", "name": "Alice Johnson", "email": "  ALICE.JOHNSON@Corporation.com " },
    { "id": "2", "name": "Bob Martin", "email": " bob@example.com " },
    { "id": "3", "name": "Carol Reyes", "email": "carol@corporation.com" },
    { "id": "4", "name": "Danilo Cruz", "email": " danilo@outlook.com " }
  ],
  "crm": [],
  "analytics": []
}


Step 3: Spin Up Docker Containers
---------------------------------
In your terminal, navigate to the n8n_training directory and run:

  docker compose up -d

Verify both containers are active:

  docker compose ps


Step 4: Initialize n8n Account
------------------------------
1. Open your browser and navigate to http://localhost:5678
2. Complete account registration using your Stratpoint email.
3. Access the blank workflow canvas.


5. EXECUTING & TESTING WORKFLOWS
----------------------------------------------------------------------
1. Click "Listen for test event" on your Webhook trigger node in n8n.
2. Send a test POST request from your host terminal:

  curl -X POST http://localhost:5678/webhook-test/signup-hook \
    -H "Content-Type: application/json" \
    -d '{
      "users": [
        { "name": "Alice Johnson", "email": "ALICE.JOHNSON@Corporation.com" },
        { "name": "Bob Martin", "email": "bob@example.com" }
      ]
    }'

Alternatively, pass a stored payload file:

  curl -X POST http://localhost:5678/webhook-test/signup-hook \
    -H "Content-Type: application/json" \
    -d @payloads/users-batch-mixed.json


6. DATA VERIFICATION
----------------------------------------------------------------------
Check that the processed items correctly routed to their respective 
destinations in the database:

* Verify CRM Endpoint (Corporate Signups - @corporation.com):
  curl http://localhost:3001/crm

* Verify Analytics Endpoint (Public Signups - Fallback):
  curl http://localhost:3001/analytics


7. DOCKER MANAGEMENT COMMANDS
----------------------------------------------------------------------
* Start environment:   docker compose up -d
* Stop environment:    docker compose stop
* Restart environment: docker compose restart
* Check logs:          docker compose logs -f mock-api
* Destroy environment: docker compose down
======================================================================
