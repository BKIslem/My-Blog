<?php

namespace App\DataFixtures;

use App\Entity\Post;
use App\Entity\User;
use App\DataFixtures\UserFixtures;
use App\Entity\Comment;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\String\Slugger\SluggerInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CommentFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private readonly SluggerInterface $slugger,
        private UserRepository $userRepository,
        private PostRepository $postRepository,
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        $Users = $this->userRepository->findOneByEmail('user@user.fr');
        $postes = $this->postRepository->findOneByTitle('Que signifie le mot IoT ?');

        //  dd($postes);

        $comment = new Comment();
        $comment->setContent("nice");
        $comment->setUser($Users);
        $comment->setPost($postes);
        $manager->persist($comment);
        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            PostFixtures::class,
        ];
    }
}
