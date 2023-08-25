<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();

        $user->setEmail('admin@admin.fr');
        $user->setPassword('123456');
        $user->setRoles(['ROLE_ADMIN']);
        $user->setName('queen');
        $manager->persist($user);
        $user = new User();
        $user->setEmail('user@user.fr');
        $user->setPassword('123456');
        $user->setName('Peaple');

        $manager->persist($user);

        $manager->flush();
    }
}
