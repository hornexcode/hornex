def is_power_of_two(n: int) -> bool:
    """
    It checks if a number is power of two
    """
    return (n & (n - 1)) == 0 and n != 0
