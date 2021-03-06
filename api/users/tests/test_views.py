import json
import os
import uuid

from django.conf import settings
from django.test import TestCase, RequestFactory

from api.firebase_auth.users import FirebaseUser
from api.users.models import User
from api.users.views import UserView
from api.utils.firebase_utils import get_anonymous_user_token, delete_collection, delete_anonymous_user, \
    get_authenticated_user_token

db = settings.FIRESTORE


class UserViewTest(TestCase):
    """
    Tests UserView
    """
    def setUp(self):
        with open('api/test_data/test_data.json') as f:
            self.test_data = json.load(f)

        self.factory = RequestFactory()
        self.token = get_anonymous_user_token()
        self.auth_token = get_authenticated_user_token()
        self.test_uuid = str(uuid.uuid4())
        self.user = FirebaseUser(self.test_data["users"]["firebase_data"])
        u = User(self.test_uuid, 'display name', photo_url='')
        u.save(db)

    def test_get(self):
        request = self.factory.get('/api/users/user', data=None, secure=False, HTTP_TOKEN=self.token)
        response = UserView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        data = json.dumps({"userData": '{ "displayName": "display name" }'})
        request = self.factory.post('/api/users/user', data=data, content_type='application/json', secure=False,
                                    HTTP_TOKEN=self.auth_token)
        request.user = self.user
        response = UserView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        print('Cleaning up users')
        delete_collection(db.collection(User.collection_name))
        delete_anonymous_user(self.token)
