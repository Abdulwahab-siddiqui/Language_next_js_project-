This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to EC2 (GitHub Actions + PM2)

This repo includes a simple, beginner-friendly deployment to an EC2 server using GitHub Actions and PM2.

### Prerequisites on EC2
- Create an EC2 instance (Ubuntu 22.04 or Amazon Linux). Allow inbound on port 3000 (or set up Nginx later for port 80).
- Add your SSH key to the instance. Note the public IP or DNS.
- Choose your app directory, e.g. `/home/ubuntu/apps/language-nextjs`.

Install Node.js and PM2 on EC2 (Ubuntu):

```bash
sudo apt update
sudo apt install -y curl build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 20
nvm use 20
npm install -g pm2
mkdir -p /home/ubuntu/apps/language-nextjs
```

Amazon Linux (alternative):

```bash
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 20
nvm use 20
npm install -g pm2
mkdir -p /home/ec2-user/apps/language-nextjs
```

### GitHub Secrets
Add these repository secrets (Settings → Secrets and variables → Actions):
- `EC2_HOST`: your EC2 public IP or DNS
- `EC2_USER`: `ubuntu` (Ubuntu) or `ec2-user` (Amazon Linux)
- `EC2_SSH_KEY`: the private SSH key contents
- `EC2_PATH`: e.g. `/home/ubuntu/apps/language-nextjs`
- `EC2_PORT` (optional): SSH port, default 22

### How it works
- On push to `main`, GitHub Actions copies the repo to `${EC2_PATH}`.
- It installs Node (via nvm if needed), installs deps, builds the app, then starts/restarts PM2 using `ecosystem.config.js`.
- The app runs on port 3000. Open it via `http://<EC2_HOST>:3000` or set up Nginx to proxy port 80 → 3000.

### PM2 commands (on EC2)
```bash
cd /home/ubuntu/apps/language-nextjs
pm2 start ecosystem.config.js
pm2 restart language-nextjs
pm2 logs language-nextjs
pm2 list
```

### Nginx (optional)
If you want the app on port 80:
```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/nextjs <<'EOF'
server {
	listen 80;
	server_name _;
	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
EOF
sudo ln -sf /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/nextjs
sudo nginx -t && sudo systemctl restart nginx
```

That's it — push to `main` to deploy.

## Self-Hosted GitHub Runner (Alternative)

If you run a GitHub Actions self-hosted runner on your EC2 instance, use the workflow at [.github/workflows/deploy-selfhosted.yml](.github/workflows/deploy-selfhosted.yml). This removes the need for SSH/SCP because the build happens directly on EC2.

### Steps to install a self-hosted runner on EC2
- Install Node.js 20 and PM2 as shown above.
- Create a directory for the runner (Ubuntu example):

```bash
cd ~
mkdir actions-runner && cd actions-runner
# Download the latest Linux x64 runner from GitHub (check GitHub docs for latest URL)
# Example (replace version with the latest):
curl -O -L https://github.com/actions/runner/releases/download/v2.X.Y/actions-runner-linux-x64-2.X.Y.tar.gz
tar xzf actions-runner-linux-x64-2.X.Y.tar.gz

# Configure the runner (get token from GitHub: Repo → Settings → Actions → Runners → New self-hosted runner)
./config.sh --url https://github.com/<OWNER>/<REPO> --token <RUNNER_TOKEN> --labels ec2,linux

# Install as a service and start
sudo ./svc.sh install
sudo ./svc.sh start
```

Then push to `main`. The self-hosted workflow will:
- Checkout code on the EC2 runner
- Set up Node 20
- Install deps and build the app
- Start/restart PM2 for `language-nextjs`

Tip: Ensure your EC2 security group allows inbound HTTP (port 3000 or via Nginx on 80).
