echo "Deploying Skriva to production..."
git pull origin main
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py compress --force
sudo systemctl restart gunicorn
sudo systemctl restart nginx
echo "Deployment completed!"
